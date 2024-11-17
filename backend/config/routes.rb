Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  namespace :api do
    namespace :v1 do
      # Rutas de eventos
      resources :events do
        post 'attendances', to: 'attendances#create', on: :member
        resources :pictures, only: [:index, :create], controller: 'event_pictures'

        collection do
          get 'all_events', to: 'events#all_events'
        end

        member do
          post 'generate_video'
        end
      end

      resources :bars do
        collection do
          get 'search'
        end
        resources :events, only: [:index]
      end

      
      resources :beers do
        resources :reviews, only: [:index, :create]
      end

      resources :users do
        collection do
          get 'search', to: 'users#search'
          get 'me', to: 'users#show'
          post 'update_push_token', to: 'users#update_push_token'
        end

        resources :reviews, only: [:index]
        resources :friendships, only: [:index, :show, :create, :destroy, :update], param: :friend_id
      end

     
      resources :attendances, only: [:create]
      resources :event_pictures, only: [:index, :create, :show, :destroy]
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
