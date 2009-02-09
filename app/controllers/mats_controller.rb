class MatsController < ApplicationController
  def create
    new_mat = BattleMats.new(params[:mat])
    new_mat.x_dimension = 10
    new_mat.y_dimension = 16
    new_mat.save
    redirect_to :action => 'index'
  end

  def destroy
    BattleMats.find_by_id(params[:id]).destroy()
    redirect_to :action => 'index'
  end
  
  def index
    @mats = BattleMats.find :all
  end
  
  def new
    redirect_to :action => 'index'    
  end
  
  def edit
    @mat = BattleMats.find_by_id(params[:id])
    @backgrounds = []
    @tiles = []
    Dir.foreach('public/images/textures/backgrounds') do |entry|
      if entry =~ /\.(png|jp.?g)$/i then
        @backgrounds << entry
      end
    end
  end
  
  def update
    mat = BattleMats.find_by_id(params[:id])
    mat.description = params[:mat][:description]
    mat.save
  end

  def show
    @mat = BattleMats.find_by_id(params[:id])
    render :layout => "plain"
  end
end
