<?php
defined('BASEPATH') or exit('No direct script access allowed');


class Fx
{
    public $log_user;
    public $CI;
    public function __construct(){
        $this->CI = &get_instance();
        $this->CI->load->library('jwt_token');
        $current_page = basename($_SERVER['PHP_SELF']);
        $data = file_get_contents('php://input');
        $url= current_url();
       if($current_page !=='Log_in'){
        $this->log_user = $this->CI->jwt_token->get_verified_token();
        $this->api_log($url,$data);
       }   
    }

    function Responce($code, $status, $data)
    {
        echo json_encode(['code' => $code, 'status' => $status, 'data' => $data]);
    }

    function login_user_id(){
    return $this->log_user->id;
    }

    public function paggination_data($data)
    {
        $page_no = $data['page_no'];
        $limit = $data['row_no'];
        $colname = $data['colname'];
        $order = $data['order'];
        unset($data['page_no'], $data['row_no'], $data['colname'], $data['order']);
        $offset = ($page_no - 1) * $limit;
        return json_encode(['page_no' => $page_no, 'limit' => $limit, 'colname' => $colname, 'order' => $order, 'offset' => $offset, 'formdata' => $data]);
    }

    public function check_user_permission($menu_id)
    {
        $this->CI->db->select(
        '
        IFNULL(add_records,0) as add_records,
        IFNULL(update_records,0) as update_records,
        IFNULL(delete_records,0) as delete_records,
        IFNULL(view_page,0) as view_page,
         '
        );
        $this->CI->db->from('user_permission');
        $this->CI->db->join('user_master', 'user_permission.user_id = user_master.id');
        $this->CI->db->join('menu', 'user_permission.menu_id = menu.menu_id');
        $this->CI->db->where('user_permission.user_id', $this->log_user->id);
        $this->CI->db->where('menu.menu_id', $menu_id);
        $query = $this->CI->db->get();
        return $query->result_array();
    }

    
    public function api_log($url,$data){
        $user_id=$this->log_user->id;
        $data=[
            'user_id'=>$user_id,
            'url'=>$url,
            'data'=>$data
        ];
        $this->CI->db->insert('api_log',$data);
    }



    public function create_log($action,$data,$menu_name,$table_name,$last_id){
       $user_id=$this->log_user->id;
       $user_name=$this->log_user->name;
        if($action=='insert'){
       $msg= "$user_name id $user_id inserted data on $table_name on id $last_id";
        }
        else if($action=='update'){
            $msg= "$user_name id $user_id updated data on $table_name on id $last_id";
        }
        else if($action=='delete'){
            $msg= "$user_name id $user_id deleted data on $table_name on id $last_id";
        }
        $data=[
            'user_id'=>$user_id,
            'menu_name'=>$menu_name,
            'action'=>$action,
            'data'=>$data,
            'action_on_table'=>$table_name,
            'msg'=>$msg
        ];

          $this->CI->db->insert('users_log',$data);

    }



}
