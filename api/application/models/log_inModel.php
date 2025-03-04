<?php
defined('BASEPATH') or exit('No direct script access allowed');

class log_inModel extends CI_Model
{

    function loggin_user($email, $password)
    {
    $where = array('email' => $email, 'password' => $password);
    return  $this->db->select('name,email,id')->where($where)->get('user_master')->result();
    }

}