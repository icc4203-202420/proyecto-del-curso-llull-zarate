class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:show, :update]

  def index
    @users = User.includes(:reviews, :address).all
    render json: { users: @users }, status: :ok
  end

  def show
    if @user
      render json: {
        user: @user.as_json(only: [:id, :first_name, :last_name, :email, :handle]), # Mostramos solo los atributos necesarios
        friends: @user.friends, # Asegúrate de que `friends` esté bien definido en el modelo
        inverse_friends: @user.inverse_friends # Lo mismo con `inverse_friends`
      }, status: :ok
    else
      render json: { error: "Usuario no encontrado" }, status: :not_found
    end
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: { user: @user }, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: { user: @user }, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  # Obtiene al usuario actual si params[:id] es 'me', de lo contrario busca por ID
  def set_user
    if params[:id] == 'me'
      @user = current_user # Obtiene el usuario actual a partir del token
      render json: { error: 'Usuario no encontrado' }, status: :not_found unless @user
    else
      @user = User.find_by(id: params[:id])
      render json: { error: 'Usuario no encontrado' }, status: :not_found unless @user
    end
  end

  def user_params
    params.require(:user).permit(
      :first_name, :last_name, :email, :age, :handle, :password,
      address_attributes: [:id, :line1, :line2, :city, :country, :country_id],
      reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
    )
  end
end
