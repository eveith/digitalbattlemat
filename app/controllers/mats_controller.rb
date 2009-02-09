class MatsController < ApplicationController
  def create
    new_mat = BattleMats.new(params[:mat])
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
  end
  
  def update
    mat = BattleMats.find_by_id(params[:id])
    mat.description = params[:mat][:description]
    mat.save
  end

  def show
    redirect_to :action => "edit"
  end
end
