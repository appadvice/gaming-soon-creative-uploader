class GameTrailersController < ApplicationController
  
  def index
    @index = JSON.parse(open('http://couchview.wp.appadvice.com/?post_type=gametrailer').read)
  end
  
  def show
    @id = params['id']
    @game = JSON.parse(open("http://couchview.wp.appadvice.com/?gametrailer=#{@id}").read)
    @index = JSON.parse(open('http://couchview.wp.appadvice.com/?post_type=gametrailer').read)
  end
end
