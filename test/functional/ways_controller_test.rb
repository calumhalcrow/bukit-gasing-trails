require 'test_helper'

class WaysControllerTest < ActionController::TestCase
  setup do
    @way = ways(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:ways)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create way" do
    assert_difference('Way.count') do
      post :create, :way => { :category => @way.category, :name => @way.name }
    end

    assert_redirected_to way_path(assigns(:way))
  end

  test "should show way" do
    get :show, :id => @way
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @way
    assert_response :success
  end

  test "should update way" do
    put :update, :id => @way, :way => { :category => @way.category, :name => @way.name }
    assert_redirected_to way_path(assigns(:way))
  end

  test "should destroy way" do
    assert_difference('Way.count', -1) do
      delete :destroy, :id => @way
    end

    assert_redirected_to ways_path
  end
end
