from flask_restful import Api
from flask import Blueprint

from .resources import get_requests
from .resources import post_requests
from .resources import delete_requests

api_blueprint = Blueprint('api', __name__)
api = Api(api_blueprint)


api.add_resource(post_requests.SampleUsers, '/sample_users')

# ----------------------GET---------------------------------------
api.add_resource(get_requests.index, '/')
api.add_resource(get_requests.GetUsers, '/get_users')
api.add_resource(get_requests.GetPublicProfile, '/public_profile')
api.add_resource(get_requests.GetGalleries, '/get_galleries')
api.add_resource(get_requests.GalleryPhotos, '/gallery_photos')
api.add_resource(get_requests.GetComments, '/get_comments')
# api.add_resource(get_requests.RestorePassword, '/restore_password')


# # ----------------------POST---------------------------------------
api.add_resource(post_requests.AddProfilePicture, '/profile_picture')
api.add_resource(post_requests.Follow, '/follow')
api.add_resource(post_requests.AddGallery, '/add_gallery')
api.add_resource(post_requests.AddComment, '/comment')
api.add_resource(post_requests.AddImage, '/add_image')


# # ----------------------DELETE---------------------------------------
api.add_resource(delete_requests.DeleteImage, '/delete_image')
api.add_resource(delete_requests.DeleteGallery, '/delete_gallery')
api.add_resource(delete_requests.DeleteComment, '/delete_comment')
api.add_resource(delete_requests.DeleteFollower, '/delete_follower')
