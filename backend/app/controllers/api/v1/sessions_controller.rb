class API::V1::SessionsController < Devise::SessionsController
  include ::RackSessionsFix
  respond_to :json

  private

  def respond_with(current_user, _opts = {})
    render json: {
      status: { 
        code: 200, 
        message: 'Logged in successfully.',
        data: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes] }
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    current_user = nil
    
    if request.headers['Authorization'].present?
      begin
        jwt_payload = JWT.decode(
          request.headers['Authorization'].split(' ').last,
          Rails.application.credentials.devise_jwt_secret_key,
          true,
          { algorithm: 'HS256' }
        ).first
        current_user = User.find(jwt_payload['sub'])
      rescue JWT::DecodeError
        render json: {
          status: 401,
          message: 'Invalid token. Please log in again.'
        }, status: :unauthorized and return
      end
    end
    
    if current_user
      # Aquí puedes agregar lógica para eliminar sesión, si aplica
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
