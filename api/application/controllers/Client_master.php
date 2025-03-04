<?php
defined('BASEPATH') or exit('No direct script access allowed');
class Client_master extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->jwt_token->get_verified_token();
        $this->load->model('client_model');
    }


    function insert_client_data()
    {
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
        $form_data = $this->input->post();

        $responce =  $this->client_model->update_data($form_data);

        echo $responce;
        return;
    }




    function delete_client_data()
    {
        $id = json_decode(file_get_contents('php://input'), true);
        $responce = $this->client_model->delete_data($id);
        echo $responce;
        return;
    }


    function edit_client_data()
    {
        $id = json_decode(file_get_contents('php://input'), true);
        $responce = $this->client_model->edit_data($id);

        echo  $responce;
        return;
    }
    
}