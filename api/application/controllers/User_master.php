<?php
defined('BASEPATH') or exit('No direct script access allowed');
class User_master extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->jwt_token->get_verified_token();
        $this->load->model('user_model');
    }
    

// inserting data in database........
    function insert_user_data()
    {

        $form_data = $this->input->post();
        $validation = array(
            array(
                'field' => 'name',
                'label' => 'User Name',
                'rules' => 'required|max_length[20]|trim',
                'errors' => array('required' => '%s value should not be blank'),
            ),
            array(
                'field' => 'PASSWORD',
                'label' => 'Password',
                'rules' => 'required|min_length[8]|max_length[15]|trim'
            ),
            array(
                'field' => 'email',
                'label' => 'Email',
                'rules' => 'required|valid_email|is_unique[user_master.email]|trim'
            ),

            array(
                'field' => 'phone',
                'label' => 'Phone',
                'rules' => 'required|min_length[10]|max_length[12]|is_unique[user_master.phone]|trim'
            ),


        );

        $this->form_validation->set_rules($validation);
        if (!$this->form_validation->run()) {
            $error = $this->form_validation->error_array();
            echo json_encode(['errors' => $error]);
            return;
        } else {
            $responce =  $this->user_model->insert_data($form_data);
            echo json_encode($responce);
            return;
        }
    }





    function update_user_data()
    {
        $form_data = $this->input->post();
        $responce =  $this->user_model->update_data($form_data);
        echo $responce;
        return;
    }




    function delete_user_data()
    {

        $id = json_decode(file_get_contents('php://input'), true);
        $responce = $this->user_model->delete_data($id);
        echo $responce;
        return;
    }




    function get_user_data()
    {

        $data = json_decode(file_get_contents('php://input'), true);
        $paggination_records =  $this->fx->paggination_data($data);
        $responce = $this->user_model->records($paggination_records);
        $this->fx->Responce(200,true,$responce);
        return;
    }



    function edit_user_data()
    {
        $id = json_decode(file_get_contents('php://input'), true);
        $responce = $this->user_model->edit_data($id);
        echo  $responce;
        return;
    }
}
