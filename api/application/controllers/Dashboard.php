<?php
defined('BASEPATH') or exit('No direct script access allowed');
class Dashboard extends CI_Controller
{

    private $log_userId;
    public function __construct()
    {
        parent::__construct();
        $this->log_userId = $this->jwt_token->get_verified_token(); 
        $this->load->model('dashboard_model');
       
    }

    function index(){
        $responce= $this->dashboard_model->all_masters_data();
        echo $responce;
        return;
    }

    function Menu(){
        $responce = $this->dashboard_model->get_menu($this->log_userId);
        $this->fx->Responce(200,true,$responce);
    }
}