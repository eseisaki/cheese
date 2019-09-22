from flask_restful import Resource
from flask import jsonify, request, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..data.users import User
from ..data.galleries import Gallery
from ..data.images import Image
from ..data.comments import Comment
import requests
from .. import STORAGE_HOST
from .. import zk_get_storage_children, zk_app

'''
# --------------------------------CONTENTS--------------------
# ____________________DeleteImage(/delete_image)______________
# ____________________DeleteGallery(/delete_gallery)__________
# ____________________DeleteComment(/delete_comment)__________
# ____________________DeleteFollower (/delete_follower)_______
'''


# Delete an image --> returns 204 when successful, 404 NOT FOUND
class DeleteImage(Resource):
    @jwt_required
    def delete(self):
        current_user = get_jwt_identity()
        me = User.objects(username=current_user).first()
        this_image_id = request.json['image_id']

        # remove image Object and file from storage
        image = Image.objects(iid=this_image_id).first()
        if image:
            active_nodes = zk_get_storage_children(zk_app)
            storage_1 = ''
            storage_2 = ''
            if len(active_nodes) > 0:
                if zk_app.exists('/storage/'+str(image.storage[0][1])):
                    storage_1 = 'http://'+STORAGE_HOST[int(image.storage[0][1])]+':100' + \
                        str(image.storage[0][1])
                if zk_app.exists('/storage/'+str(image.storage[1][1])):
                    storage_2 = 'http://'+STORAGE_HOST[int(image.storage[1][1])]+':100' + \
                        str(image.storage[1][1])

            data = {'filename': image.path}
            if storage_1 != '' or storage_2 != '':
                requests.delete(storage_1 + '/delete_image', json=data)
                requests.delete(storage_2 + '/delete_image', json=data)
                image.delete()

                # remove from the gallery list
                for gallery in me.galleries:
                    for image_id in gallery.images:
                        if image_id == this_image_id:
                            gallery.images.remove(image_id)
                            me.save()
                return make_response(jsonify('OK'), 200)
            else:
                return make_response(jsonify('storage_down'), 500)
            
        return make_response(jsonify('BAD'), 404)


# Delete gallery  --> returns 404 or 204
class DeleteGallery(Resource):
    @jwt_required
    def delete(self):
        current_user = get_jwt_identity()
        me = User.objects(username=current_user).first()
        gallery_title = request.json['gallery_title']
        list_galleries = []

        try:
            gallery = me.galleries.get(title=gallery_title)
            for image_id in gallery.images:
                image = Image.objects(iid=image_id).first()
                if image:
                    image.delete()
            me.galleries.remove(gallery)
            me.save()
        except:
            return make_response(jsonify("Gallery doen't exists"), 404)

        for each_gallery in me.galleries:
            list_galleries.append(each_gallery.title)
        output = {'galleries': list_galleries}
        return make_response(jsonify(output), 200)


# Delete comment by id-->returns 204 or 403
class DeleteComment(Resource):
    @jwt_required
    def delete(self):
        current_user = get_jwt_identity()
        comment_id = request.json['comment_id']
        image_id = request.json['image_id']
        image = Image.objects(iid=image_id).first()
        if not comment_id or not image_id:
            return make_response(jsonify('BAD'), 404)
        comment = image.comments.get(_id=comment_id)
        image.comments.remove(comment)
        image.save()
        return make_response(jsonify('OK'), 200)


# delete follower --> returns 403 or 204
class DeleteFollower(Resource):
    @jwt_required
    def delete(self):
        current_user = get_jwt_identity()
        me = User.objects(username=current_user).first()
        unfollow = request.json['username']
        if unfollow not in me.following:
            return make_response(jsonify("You are not following this user"), 403)
        
        friend = User.objects(username=unfollow).first()
        if friend is None:
            return make_response(jsonify('user not found'), 404)

        friend.followers.remove(current_user)
        friend.save()
        me.following.remove(unfollow)
        me.save()

        output = {'followers_num': len(friend.followers)}
        
        return make_response(jsonify(output), 200)