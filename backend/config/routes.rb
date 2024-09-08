Rails.application.routes.draw do
  # Health check route
  get 'up', to: 'rails/health#show', as: :rails_health_check

  # Devise routes for authentication
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  # Custom route for current_user
  get 'current_user', to: 'current_user#index'

  # API routes
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :bars
      resources :beers do
        resources :reviews, only: [:index, :create] # Anidar reseñas dentro de cervezas
      end
      resources :users do
        resources :reviews, only: [:index] # Rutas para reseñas por usuario
      end
      resources :reviews, only: [:show, :update, :destroy] # Rutas para acciones específicas de reseñas

      # Custom routes for events
      get 'events/show'
      post 'events/create'
      patch 'events/update'
      delete 'events/destroy'
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
