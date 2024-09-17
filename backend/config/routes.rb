Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Rutas existentes
      resources :events do
        post 'attend', on: :member
      end

      resources :bars do
        collection do
          get 'search'
        end
        resources :events, only: [:index]
      end

      resources :beers
      resources :users do
        resources :reviews, only: [:index]
      end

      resources :reviews, only: [:index, :show, :create, :update, :destroy]

      # Añadir esta línea para definir las rutas para attendances
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
