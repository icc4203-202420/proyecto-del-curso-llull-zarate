
class API::V1::FriendshipsController < ApplicationController
  before_action :set_user

  # GET /api/v1/users/:user_id/friendships
  def index
    @friendships = Friendship.includes(:friend).where(user_id: @user.id)

    friends_data = @friendships.map do |friendship|
      {
        id: friendship.friend.id,
        name: "#{friendship.friend.first_name} #{friendship.friend.last_name}",
        email: friendship.friend.email,
        handle: friendship.friend.handle
      }
    end

    render json: { friends: friends_data }, status: :ok
  end

  # GET /api/v1/users/:user_id/friendships/:friend_id
  def show
    friend = User.find_by(id: params[:friend_id])

    if friend.nil?
      return render json: { error: "Friend not found" }, status: :not_found
    end

    friendship = Friendship.find_by(user_id: @user.id, friend_id: friend.id)

    if friendship
      response_data = {
        is_friend: true,
        friendship: {
          friend_id: friendship.friend_id,
          bar_id: friendship.bar_id
        }
      }
      
      # Solo incluye `event_id` si está presente
      response_data[:friendship][:event_id] = friendship.event_id if friendship.event_id.present?

      render json: response_data, status: :ok
    else
      render json: { is_friend: false }, status: :ok
    end
  end

  # POST /api/v1/users/:user_id/friendships
  def create
    friend = User.find_by(id: friendship_params[:friend_id])
  
    if friend.nil?
      render json: { error: "Friend not found" }, status: :not_found
      return
    end
  
    if @user.friendships.exists?(friend: friend)
      render json: { error: "Already friends" }, status: :unprocessable_entity
      return
    end
  
    # Asigna un valor predeterminado a bar_id si no se ha proporcionado
    @friendship = @user.friendships.build(friendship_params)
    @friendship.bar_id ||= 1 # Cambia a un valor predeterminado adecuado si es necesario

    if @friendship.save
      render json: @friendship, status: :created
    else
      render json: @friendship.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def friendship_params
    params.require(:friendship).permit(:friend_id, :bar_id, :event_id)
  end
end
