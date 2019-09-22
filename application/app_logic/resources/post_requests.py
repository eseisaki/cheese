from flask_restful import Resource
from flask import jsonify, request, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from ..data.users import User
from ..data.galleries import Gallery
from ..data.images import Image
from ..data.comments import Comment
import uuid
import requests
import random
from .. import STORAGE_HOST
from .. import zk_get_storage_children
from .. import zk_app

'''
# ------------------------CONTENTS-----------------------------
# _______________________AddProfilePicture(/profile_picture)___
# _______________________AddGallery(/add_gallery)______________
# _______________________AddComment (/comment)_________________
# _______________________AddImage(/add_image)________________
'''


class SampleUsers(Resource):
    def post(self):
        user = User()
        user.username = 'user'
        user.email = 'user@email.com'
        user.password = 'very_strong_password'
        gallery = Gallery()
        gallery.title = 'gallery'
        gallery.owner = 'user'
        user.galleries.insert(0, gallery)
        user.save()
        for i in range(5):
            user = User()
            user.username = 'user'+str(i)
            user.email = 'user'+str(i)+'@email.com'
            user.password = 'very_strong_password'
            gallery = Gallery()
            gallery.title = 'gallery'
            gallery.owner = 'user'+str(i)
            user.galleries.insert(0, gallery)
            user.save()
        return make_response(jsonify('im ok mom'), 201)

# Used when we want to add or change profile pic


class AddProfilePicture(Resource):
    @jwt_required
    def post(self):
        current_user = get_jwt_identity()
        me = User.objects(username=current_user).first()

        if 'file' not in request.files:
            return make_response(jsonify('file_type'), 400)
        file = request.files['file']

        if file.filename == '':
            return make_response(jsonify('file_name_empty'), 400)

        if not file or not allowed_file(file.filename):
            return make_response(jsonify('file_extension'), 400)

        if len(zk_get_storage_children(zk_app)) < 2:
            return make_response(jsonify('storage_down'), 501)

        rand_storage = random.sample(zk_get_storage_children(zk_app), 2)
        sh_1 = int(rand_storage[0])
        sh_2 = int(rand_storage[1])

        selected_storage_1 = (
            'http://'+STORAGE_HOST[sh_1]+':100', rand_storage[0])
        selected_storage_2 = (
            'http://'+STORAGE_HOST[sh_2]+':100', rand_storage[1])

        my_string = file.filename
        idx = my_string.index('.')
        filename = secure_filename(my_string[:idx] + '_' + uuid.uuid4().hex +
                                   my_string[idx:])

        image = Image()
        image.path = filename
        image.owner = current_user
        image.storage.append(selected_storage_1)
        image.storage.append(selected_storage_2)
        image.save()
        image.iid = str(image.id)
        image.save()

        me.profile_image = image.iid
        me.save()

        try:
            sendFile = {"file": (filename, file.stream, file.mimetype)}
            requests.post(
                selected_storage_1[0] + selected_storage_1[1] + '/post_image', files=sendFile)

            file.seek(0)
            sendFile = {"file": (filename, file.stream, file.mimetype)}
            requests.post(
                selected_storage_2[0] + selected_storage_2[1] + '/post_image', files=sendFile)
            
            path = 'http://localhost:100'+rand_storage[0]+'/'+filename
            output = {'profile_image': path}
            return make_response(jsonify(output), 201)
        except:
            return make_response(jsonify({'path': 'storage_error'}), 500)


# Used when we want to follow a user/doesn't return anything


class Follow(Resource):
    @jwt_required
    def post(self):
        current_user = get_jwt_identity()
        to_follow = request.json['username']
        friend = User.objects(username=to_follow).first()
        if friend not in User.objects:
            return make_response("BAD", 404)
        me = User.objects(username=current_user).first()
        # make sure its not me or its not already in my following list
        if to_follow in me.following or current_user in friend.followers or to_follow == current_user:
            output = jsonify("You can't follow this user")
            return make_response(output, 406)  # 406 not accepted

        friend.followers.append(current_user)
        friend.save()
        me.following.append(to_follow)
        me.save()
        output = {'followers_num': len(friend.followers)}
        return make_response(jsonify(output), 201)

# Used to create a new gallery / returns--> gallery info


class AddGallery(Resource):
    @jwt_required
    def post(self):
        current_user = get_jwt_identity()
        gallery = Gallery()
        title = request.json['gallery_title']
        list_galleries = []
        if not title or title == '':
            title = "Gallery"

        user = User.objects(username=current_user).first()
        len_title = len(title)
        
        for emb_gallery in user.galleries:
            list_galleries.append(emb_gallery.title)
            if emb_gallery.title == title and len(emb_gallery.title) == len_title:
                title = title + '(1)'
            elif emb_gallery.title[-3] == "(" and emb_gallery.title[
                    -1] == ")" and emb_gallery.title[:-3] == title:
                s = list(emb_gallery.title)
                i = int(emb_gallery.title[-2]) + 1
                s[-2] = str(i)
                title = "".join(s)

        list_galleries.insert(0, title)
        gallery.title = title
        gallery.owner = current_user
        user.galleries.insert(0, gallery)
        user.save()
        output = { 'galleries': list_galleries}
        return make_response(jsonify(output), 201)

# Used to add pictures in a gallery/ needs storage service to be successful


class AddImage(Resource):
    @jwt_required
    def post(self):
        current_user = get_jwt_identity()
        flag = False
        g_title = request.args.get('gallery_title')
        me = User.objects(username=current_user).first()
        for emb_gallery in me.galleries:
            if emb_gallery.title == g_title:
                flag = True
                break
        if not flag:
            return make_response(jsonify('gallery_not_found'), 404)

        if 'file' not in request.files:
            return make_response(jsonify('file_type'), 400)
        file = request.files['file']

        if file.filename == '':
            return make_response(jsonify('file_name_empty'), 400)

        if not file or not allowed_file(file.filename):
            return make_response(jsonify('file_extension'), 400)

        if len(zk_get_storage_children(zk_app)) < 2:
            return make_response(jsonify('storage_down'), 501)

        rand_storage = random.sample(zk_get_storage_children(zk_app), 2)
        sh_1 = int(rand_storage[0])
        sh_2 = int(rand_storage[1])

        selected_storage_1 = (
            'http://'+STORAGE_HOST[sh_1]+':100', rand_storage[0])
        selected_storage_2 = (
            'http://'+STORAGE_HOST[sh_2]+':100', rand_storage[1])

        my_string = file.filename
        idx = my_string.index('.')
        filename = secure_filename(my_string[:idx] + '_' + uuid.uuid4().hex +
                                   my_string[idx:])
        image = Image()
        image.path = filename
        image.owner = current_user
        image.storage.append(selected_storage_1)
        image.storage.append(selected_storage_2)
        image.save()
        image.iid = str(image.id)
        image.save()
        emb_gallery.images.insert(0, image.iid)
        me.save()

        try:
            sendFile = {"file": (filename, file.stream, file.mimetype)}
            requests.post(
                selected_storage_1[0] + selected_storage_1[1] + '/post_image', files=sendFile)

            file.seek(0)
            sendFile = {"file": (filename, file.stream, file.mimetype)}
            requests.post(
                selected_storage_2[0] + selected_storage_2[1] + '/post_image', files=sendFile)
            
            path = 'http://localhost:100'+rand_storage[0]+'/'+filename
            output = {
                'id': image.iid,
                'path': path,
                'owner': image.owner,
                'reg_date': image.registered_date,
                'description': image.description,
                'comments': image.comments
            }
            return make_response(jsonify(output), 201)
        except:
            return make_response(jsonify({'path': 'storage_error'}), 500)


# Add comment to a specific photo ---> returns 404,403 or 201
class AddComment(Resource):
    @jwt_required
    def post(self):
        current_user = get_jwt_identity()
        comment = Comment()
        image_id = request.json['image_id']
        text = request.json['text']
        comment_id = uuid.uuid4().hex
        image = Image.objects(iid=image_id).first()

        if not image:
            output = "Image doesn't exists"
            return make_response(jsonify(output), 404)

        user = User.objects(username=current_user).first()
        if image.owner not in user.following and current_user != image.owner:
            output = "Not allowed!"
            return make_response(jsonify(output), 403)

        comment.owner = current_user
        comment.text = text
        comment._id = comment_id
        image.comments.append(comment)
        image.save()
        output = {
                'id': comment._id,
                'date': comment.registered_date,
                'text': comment.text,
                'owner': comment.owner
        }

        return make_response(jsonify(output), 201)


ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
