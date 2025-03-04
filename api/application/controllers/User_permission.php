<?php
defined('BASEPATH') or exit('No direct script access allowed');
class User_permission extends CI_Controller
{
    
    
   

        private $log_userId;
    
        public function __construct() {
            parent::__construct();
            $this->log_userId = $this->jwt_token->get_verified_token(); 
            $this->load->model('permission_model');
        }
    
        function get_users() {
            $data = $this->permission_model->all_users($this->log_userId); 
            $this->fx->Responce('200', 'true', $data);
            return;
        }
    
    
    function permission_records(){
        $id = json_decode(file_get_contents('php://input'), true);
        $data= $this->permission_model->permission_records($id);
        $this->fx->Responce('200','true',$data);
        return;

    }

    function add_permission_records(){
        $data = json_decode(file_get_contents('php://input'), true);
       $result= $this->permission_model->add_records($data['permission_data']);
       if($result){
           $this->fx->Responce('200','true',"data updated successfully");
       }
       else{
        $this->fx->Responce('400','false',"data not updated");
       }
            
    }

}
