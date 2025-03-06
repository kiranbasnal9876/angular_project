<?php
defined('BASEPATH') or exit('No direct script access allowed');
class Client_master extends CI_Controller
{

 
    private $check_permission;
    public function __construct()
    {
        parent::__construct();
        $this->load->model('client_model');
        $this->check_permission=$this->fx->check_user_permission(3);
    }


    function insert_client_data()
    {
        if($this->check_permission[0]['add_records']==0){
            echo "you have not access this page";
            return;
        }
        else{

            $form_data = $this->input->post();
            $validation = array(
                array(
                    'field' => 'name',
                    'label' => 'Client Name',
                    'rules' => 'required|max_length[20]|trim',   
                ),
              
                array(
                    'field' => 'email',
                    'label' => 'Email',
                    'rules' => 'required|valid_email|is_unique[client_master.email]|trim'
                ),
    
                array(
                    'field' => 'phone',
                    'label' => 'Phone',
                    'rules' => 'required|min_length[10]|max_length[12]|is_unique[client_master.phone]|trim'
                ),
    
                array(
                    'field' => 'state_id',
                    'label' => 'State',
                    'rules' => 'required|trim'
                ),
    
                array(
                        'field' => 'district_id',
                        'label' => 'district',
                        'rules' => 'required|trim'
                ),
            
                array(
                    'field' => 'address',
                    'label' => 'Address',
                    'rules' => 'required|trim'
                ),
                array(
                    'field' => 'pincode',
                    'label' => 'Pin Code',
                    'rules' => 'required|min_length[4]|max_length[8]|trim'
                ),
          
    
    
            );
    
            $this->form_validation->set_rules($validation);
            if (!$this->form_validation->run()) {
                $error = $this->form_validation->error_array();
                echo json_encode(['errors' => $error]);
                return;
            } else {
                $responce =  $this->client_model->insert_data($form_data);
                echo json_encode($responce);
                return;
            }
        }
   

       
    }


    function get_states()
    {
        
        $data =  $this->client_model->get_states();
        echo json_encode(['states'=>$data]);
        return;
    
    }

       function get_destrict()
       {

        $id = json_decode(file_get_contents('php://input'), true);
       
           $data =  $this->client_model->get_destrict($id);
           echo json_encode(['district'=>$data]);
           return;
          
       }
      

       function get_client_data()
       {
        $data = json_decode(file_get_contents('php://input'), true);
         $paggination_records =  $this->fx->paggination_data($data);
           $responce = $this->client_model->records($paggination_records);
           $this->fx->Responce(200,true,$responce);
           return;
       }
   


       

    function update_client_data()
    {
        if($this->check_permission[0]['update_records']==0){
            echo "you have not access this page";
            return;
        }
        else{
            $form_data = $this->input->post();
            $responce =  $this->client_model->update_data($form_data);
            $this->fx->Responce(200,true,"data updated successfully");
            return;
        }
    }


    function delete_client_data()
    {
        if($this->check_permission[0]['delete_records']==0){
            echo "you have not access this page";
            return;
        }
        $id = json_decode(file_get_contents('php://input'), true);
        $responce = $this->client_model->delete_data($id);
        echo $responce;
        return;
    }


    function edit_client_data()
    {
        if($this->check_permission[0]['update_records']==0){
            echo "you have not access this page";
            return;
        }
        $id = json_decode(file_get_contents('php://input'), true);
        $responce = $this->client_model->edit_data($id);

        echo  $responce;
        return;
    }


    function get_permission(){
     $responce= $this->client_model->permission_details();
     $this->fx->Responce(200,true,$responce);
    }
    
}