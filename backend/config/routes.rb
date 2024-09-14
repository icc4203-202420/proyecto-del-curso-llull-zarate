Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :events do
        # Ruta para confirmar asistencia a un evento
        post 'attend', on: :member
      end
      resources :bars do
        # Ruta personalizada para buscar bares
        collection do
          get 'search'
        end
      end
      resources :beers
      resources :users do
        resources :reviews, only: [:index]
      end
      resources :reviews, only: [:index, :show, :create, :update, :destroy]
    end
  end
  
  # Devise authentication routes
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  get 'current_user', to: 'current_user#index'
  get "up" => "rails/health#show", as: :rails_health_check
end
