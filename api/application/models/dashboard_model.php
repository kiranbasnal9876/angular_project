<?php
defined('BASEPATH') or exit('No direct script access allowed');



class dashboard_model extends CI_Model
{

        function all_masters_data(){
            $user_data=  $this->db->get("user_master")->result();
            $client_data=  $this->db->get("client_master")->result();
            $item_data=  $this->db->get("item_master")->result();
            $invoice_data=  $this->db->select("SUM(total_amount) as total")->get("invoice_master")->result();
            return ["user_data"=>count($user_data),"client_data"=>count($client_data) ,"item_data"=>count($item_data),"invoice_data"=>$invoice_data];
            
        }
          function get_menu($id){
            $this->db->select('menu.menu_id,menu_path,menu_icon,menu_name');
            $this->db->from('menu');
            $this->db->join('user_permission user', 'menu.menu_id = user.menu_id');
            $this->db->where('user.user_id', $id);
            $this->db->where('user.view_page', 1);
            return $this->db->get()->result_array();
          }
    
}