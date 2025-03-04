<?php
defined('BASEPATH') or exit('No direct script access allowed');
class Item_master extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->jwt_token->get_verified_token();
        $this->load->model('item_model');
        $config['upload_path'] = './Item_images/';
            
         $config['allowed_types'] = 'jpeg|jpg|gif|png';
        $this->load->library('upload', $config);
    }


    function insert_item_data()
    {

      
        $form_data = $this->input->post();
        $validation = array(
            array(
                'field' => 'itemPrice',
                'label' => 'Price',
                'rules' => 'required|min_length[2]|max_length[10]|trim'
        ),
     
        array(
                'field' => 'itemD',
                'label' => 'Item Description ',
                'rules' => 'required|trim'
        ),
     
        array(
            'field' => 'itemName',
            'label' => 'Item Name',
            'rules' => 'required|is_unique[item_master.itemName]|trim'
    ),
    


        );

        $this->form_validation->set_rules($validation);

        if (!$this->form_validation->run()) {
            $error = $this->form_validation->error_array();

            echo json_encode(['errors' => $error]);
        } 
        else{


            $this->upload->do_upload('itemPath');
            $form_data['itemPath']=$this->upload->data('file_name');
            $responce =  $this->item_model->insert_data($form_data);

            echo json_encode($responce);
            return;

            
    }
        }





    
        function get_item_data()
        {
    
            $data = json_decode(file_get_contents('php://input'), true);
            $paggination_records =  $this->fx->paggination_data($data);
            
            $responce = $this->item_model->records( $paggination_records);
    
            $this->fx->Responce(200,true,$responce);
            return;
        }
    
 
 
        
 
     function update_item_data()
     {
         $form_data = $this->input->post();
       
        if(!empty($_FILES['itemPath']['name'])){
          
            $config['upload_path'] = './Item_images/';
            
            $config['allowed_types'] = 'jpeg|jpg|gif|png';
           

            $this->upload->do_upload('itemPath');
           $form_data['itemPath']=  $this->upload->data('file_name');  
 
        }
        else{
            unset($form_data['itemPath']);
        }
       
         $responce =  $this->item_model->update_data($form_data);
 
         echo $responce;
         return;
     }
 
 
 
 
     function delete_item_data()
     {
 
         $id = json_decode(file_get_contents('php://input'), true);
         $responce = $this->item_model->delete_data($id);
         echo $responce;
         return;
     }
 
 
     function edit_item_data()
     {
         $id = json_decode(file_get_contents('php://input'), true);
         $responce = $this->item_model->edit_data($id);
         echo  $responce;
         return;
     }
     
 }



