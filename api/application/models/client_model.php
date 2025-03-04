<?php
defined('BASEPATH') or exit('No direct script access allowed');



class client_model extends CI_Model
{

    public function insert_data($form_data)
    {
        if ($this->db->insert('client_master', $form_data)) {
            return [
                'status' => 200,
                'message' => 'Data inserted successfully'
            ];
        } else {
            return [
                'status' => 400,
                'message' => 'Database insert failed',

            ];
        }
    }



    function get_states()
    {
        return  $this->db->get('state_master')->result_array();
    }



    function get_destrict($id)
    {
        return $this->db->where('state_id', $id)->get('district_master')->result_array();
    }




    function records($data)
    {

       
        $pagination = json_decode($data);
       
        foreach ($pagination->formdata as $key => $value) {
            $this->db->like($key, $value);
        }


        $this->db->join("state_master sm ", "sm.state_id=client_master.state_id");
        $this->db->join("district_master dm ", "dm.district_id=client_master.district_id");
       

        $this->db->select(" client_master.id,client_master.name,client_master.phone,client_master.email,CONCAT_WS(', ', client_master.address, client_master.pincode,dm.district_name,sm.state_name) AS address");

        $records = $this->db->order_by($pagination->colname, $pagination->order)->get('client_master', $pagination->limit, $pagination->offset)->result_array();

        $total_rows = $this->db->get('client_master')->num_rows();

        $total_page  = ceil($total_rows / $pagination->limit);


        return ['table' => $records, 'page_no' => $pagination->page_no, 'total_page' => $total_page];
    }



    
    function delete_data($id)
    {

        if ($this->db->where('id', $id)->delete('client_master')) {
            return json_encode([
                'status' => 200
            ]);
        } else {
            return json_encode([
                'status' => 400
            ]);
        }
    }





    function   edit_data($id)
    {


        $data = $this->db->where('id', $id)->get('client_master')->result_array();

        if ($data) {

            return json_encode(['data' => $data]);
        } else {
            return json_encode(['error' => 'no data found']);
        }
    }




    function update_data($form_data){
     
        $email = $form_data['email'];
        $phone = $form_data['phone'];
        $id=$form_data['id'];

      
   
         $this->db->where('email', $email);
         $this->db->where('id !=', $id);
        $check_email =   $this->db->get('client_master')->num_rows();

           $this->db->where('phone', $phone);
         $this->db->where('id !=', $id);
        $check_phone =   $this->db->get('client_master')->num_rows();



        if ($check_email == false &&  $check_phone == false) {
            $this->db->where('id', $id);
            return  $this->db->update('client_master', $form_data);
        } 
        else {
            return json_encode(['error'=>" your email or phone is duplicate"]);
        }
    }

    






}