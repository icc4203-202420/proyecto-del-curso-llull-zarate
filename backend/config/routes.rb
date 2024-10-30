Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Otras rutas

      resources :events do
        post 'attendances', to: 'attendances#create', on: :member # Asocia la ruta a AttendancesController#create
      end

      resources :bars do
        collection do
          get 'search'
        end
        resources :events, only: [:index]
      end

      resources :beers do
        resources :reviews, only: [:index, :create] # Anidar reseñas dentro de cervezas
      end

      resources :users do
        resources :reviews, only: [:index]
        collection do
          get 'search', to: 'users#search'
          get 'me', to: 'users#show'
        end

        # Anidar friendships dentro de users
        resources :friendships, only: [:index, :show, :create, :destroy, :update], param: :friend_id
      end

      resources :attendances, only: [:create]
    end
  end

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
