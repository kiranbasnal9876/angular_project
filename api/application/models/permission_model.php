<?php
defined('BASEPATH') or exit('No direct script access allowed');

class permission_model extends CI_Model
{

    function all_users($id)
    {
        return   $this->db->where('id !=', $id)->get('user_master')->result_array();
    }

    function permission_records($id)
    {

        $this->db->select('menu.menu_id,user_permission.user_id,menu.menu_name,IFNULL(add_records, 0) AS add_records,IFNULL(update_records, 0) AS update_records,IFNULL(delete_records, 0) AS delete_records,IFNULL(view_page, 0) AS view_page');
        $this->db->from('menu');
        $this->db->join('user_permission', 'menu.menu_id = user_permission.menu_id AND  user_id =' . $this->db->escape($id), 'left');
        return  $this->db->get('')->result_array();
    }


    function add_records($data)
    {
        $user_id = $data[0]['user_id'];
        $this->db->where('user_id', $user_id);
        if ($this->db->delete('user_permission')) {
            foreach ($data as $index => $value) {
            unset($value['menu_name']);
            $this->db->insert('user_permission', $value);
            }
            return 1;
        } else {
            return 0;
        }
    }
}
