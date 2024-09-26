class API::V1::FriendshipsController < ApplicationController
  before_action :verify_jwt_token
  before_action :find_user_by_handle, only: [:create]

  # POST /api/v1/friendships
  def create
    friendship = Friendship.new(user: current_user, friend: @friend, bar_id: params[:bar_id])

    if friendship.save
      render json: { message: 'Friend added successfully.' }, status: :created
    else
      render json: friendship.errors.full_messages, status: :unprocessable_entity
    end
  end

  # GET /api/v1/friendships/search
  def search
    users = User.where("handle LIKE ?", "%#{params[:query]}%")
    if users.any?
      render json: { users: users }, status: :ok
    else
      render json: { message: 'No users found.' }, status: :not_found
    end
  end

  private

  def find_user_by_handle
    @friend = User.find_by(handle: params[:handle])
    render json: { error: 'User not found' }, status: :not_found unless @friend
  end

  def verify_jwt_token
    authenticate_user!
    render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user
  end
end
