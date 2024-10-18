class API::V1::CountriesController < ApplicationController
  def index
    @countries = Country.all
    render json: { countries: @countries }, status: :ok
  end
end
