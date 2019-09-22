from flask_restful import Resource
from flask import jsonify, request, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from ..data.users import User
from ..data.galleries import Gallery
from ..data.images import Image
from ..data.follow_obj import FollowObj
from .. import zk_app, zk_get_storage_children
import uuid
import requests
import string
import random

'''
# ----------------------------------------CONTENTS-----------------------------
# __________________________GetUsers (/get_users)______________________________
# __________________________GetPublicProfile (/public_profile)_________________
# __________________________GetGalleries (/get_galleries)______________________
# __________________________GalleryPhotos(/gallery_photos)_____________________
# __________________________GetComments (/get_comments)________________________
# __________________________RestorePassword (/restore_password)________________
'''


class index(Resource):
    def get(self):
        return "Hello from ~Application"


# Used when click to a user/ returns-->
# Users info
# followers-following lists and num
# if the user is a friend and if its me
class GetUsers(Resource):
    @jwt_required
    def get(self):
        current_user = get_jwt_identity()
        me = User.objects(username=current_user).first()
        user_list = []
        for user in User.objects:
            if user.username != current_user:
                follow = FollowObj()
                follow.in_common = False
                if user.username in me.following:
                    follow.in_common = True

                follow.username = user.username
                follow.profile_image = user.profile_image
                user_list.append(follow)
            else:
                continue
        return make_response(jsonify(user_list), 200)


class GetPublicProfile(Resource):
    @jwt_required
    def get(self):
        is_stranger = False
        my_profile = False
        following_list = []
        followers_list = []
        user_name = request.args.get('username')
        current_user = get_jwt_identity()

        me = User.objects(username=current_user).first()
        try:
            user = User.objects(username=user_name).first()
        except:
            user = None

        if user is None:
            return make_response(jsonify("Not exists"), 404)
        if current_user != user_name and user_name not in me.following:
            is_stranger = True

        if current_user == user_name:
            my_profile = True
        # fill the following list
        for following_username in user.following:
            follow = FollowObj()
            follow.in_common = False
            follower = User.objects(username=following_username).first()
            if following_username in me.following:
                follow.in_common = True

            if following_username != current_user and following_username != user_name:
                follow.username = following_username
                follow.profile_image = follower.profile_image
                following_list.append(follow)
        # fill the followers list
        for follower_username in user.followers:
            follow = FollowObj()
            follow.in_common = False
            follower = User.objects(username=follower_username).first()
            if follower_username in me.following:
                follow.in_common = True

            if follower_username != current_user and follower_username != user_name:
                follow.username = follower_username
                follow.profile_image = follower.profile_image
                followers_list.append(follow)

        image = Image.objects(iid=user.profile_image).first()
        active_nodes = zk_get_storage_children(zk_app)
        this_path = ''
        if len(active_nodes) > 0 and image:
            if zk_app.exists('/storage/'+str(image.storage[0][1])):
                this_path = 'http://localhost:100' + \
                    str(image.storage[0][1]) + '/' + image.path
            elif zk_app.exists('/storage/'+str(image.storage[1][1])):
                this_path = 'http://localhost:100' + \
                    str(image.storage[1][1]) + '/' + image.path

        output = {
            'username': user.username,
            'reg_date': user.registered_date,
            'is_stranger': is_stranger,
            'my_profile': my_profile,
            'following': following_list,
            'followers': followers_list,
            'followers_num': len(user.followers),
            'following_num': len(user.following),
            'profile_image': this_path
        }
        return make_response(jsonify(output), 200)


'''
 Used to get Gallery titles from galleries that belong to me or to a friend
 returns --> list of titles
'''


class GetGalleries(Resource):
    @jwt_required
    def get(self):
        my_profile = False
        is_stranger = False
        user_name = request.args.get('username')
        current_user = get_jwt_identity()
        galleries = []
        me = User.objects(username=current_user).first()
        if user_name not in me.following and user_name != current_user:
            return make_response(jsonify("You are not authorized"), 403)
        user = User.objects(username=user_name).first()
        for emb_gallery in user.galleries:
            galleries.append(emb_gallery.title)

        if current_user == user_name:
            my_profile = True
        if current_user != user_name and user_name not in me.following:
            is_stranger = True

        output = {'galleries': galleries, 'my_profile': my_profile, 'is_stranger': is_stranger}
        return make_response(jsonify(output), 200)


'''
 Used when we want all images from a gallery
 returns --> image info
'''


class GalleryPhotos(Resource):
    @jwt_required
    def get(self):
        user_name = request.args.get('username')
        gallery_title = request.args.get('gallery_title')

        current_user = get_jwt_identity()
        me = User.objects(username=current_user).first()
        output = []
        if user_name not in me.following and user_name != current_user:
            output = "Oooops user doesn't exists!"
            return make_response(jsonify(output), 404)
        user = User.objects(username=user_name).first()
        try:
            gallery = user.galleries.get(title=gallery_title)
        except:
            gallery = None

        if gallery is None:
            output = "Gallery doesn't exists!!"
            return make_response(jsonify(output), 404)
        for image_id in gallery.images:
            image = Image.objects(iid=image_id).first()

            active_nodes = zk_get_storage_children(zk_app)
            if len(active_nodes) == 0:
                continue
            else:
                if zk_app.exists('/storage/'+str(image.storage[0][1])):
                    this_path = "http://localhost:100" + \
                        str(image.storage[0][1]) + '/' + image.path
                elif zk_app.exists('/storage/'+str(image.storage[1][1])):
                    this_path = "http://localhost:100" + \
                        str(image.storage[1][1]) + '/' + image.path
                else:
                    continue

            output.append({
                'id': image.iid,
                'path': this_path,
                'owner': image.owner,
                'reg_date': image.registered_date,
                'description': image.description,
                'comments': image.comments
            })

        # if no images were Returned but they should --> Storages are down
        if len(output) == 0 and len(gallery.images) != 0:
            return make_response(jsonify('storage_down'), 501)

        return make_response(jsonify(output), 200)


class GetComments(Resource):
    @jwt_required
    def get(self):
        output = []
        current_user = get_jwt_identity()
        me = User.objects(username=current_user).first()
        user_name = request.args.get('username')
        image_id = request.args.get('image_id')
        if user_name not in me.following and user_name != current_user:
            output = "Forbidden access!!!"
            return make_response(jsonify(output), 403)

        image = Image.objects(iid=image_id).first()
        if not image:
            output = "Image doesn't exists!!"
            return make_response(jsonify(output), 404)
        for comment in image.comments:
            output.append({
                'id': comment._id,
                'date': comment.registered_date,
                'text': comment.text,
                'owner': comment.owner
            })
        return make_response(jsonify(output), 200)


class RestorePassword(Resource):
    @jwt_required
    def get(self):
        email = request.json['email']
        user = User.objects(email=email).first()
        if not user:
            output = "User doesn't exists!!"
            return make_response(jsonify(output), 404)

        new_password = randompassword()
        hashed_pw = generate_password_hash(new_password, method='sha256')
        user.password = hashed_pw
        user.username = user.username
        user.save()
        return make_response(jsonify(new_password), 200)


def randompassword():
    chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
    size = random.randint(8, 12)
    return ''.join(random.choice(chars) for x in range(size))
