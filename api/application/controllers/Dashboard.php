<?php
defined('BASEPATH') or exit('No direct script access allowed');
class Dashboard extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('dashboard_model');
    }

    function index(){
        $responce= $this->dashboard_model->all_masters_data();
       $this->fx->Responce(200,true,$responce);
        return;
    }

    function Menu(){
        $responce = $this->dashboard_model->get_menu($this->fx->login_user_id());
        $this->fx->Responce(200,true,$responce);
        return;
    }
}