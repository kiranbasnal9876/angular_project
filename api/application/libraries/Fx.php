<?php
defined('BASEPATH') or exit('No direct script access allowed');


class Fx{
    public function __construct() {
    
    }

   function Responce($code,$status,$data){
        echo json_encode(['code'=>$code,'status'=>$status,'data'=>$data]); 
   }


   public function paggination_data($data)
   {
    
       $page_no = $data['page_no'];
       $limit = $data['row_no'];
       $colname = $data['colname'];
       $order = $data['order'];

       unset($data['page_no'], $data['row_no'], $data['colname'], $data['order']);

       $offset = ($page_no - 1) * $limit;

       return json_encode(['page_no'=>$page_no,'limit'=>$limit,'colname'=>$colname,'order'=>$order,'offset'=>$offset,'formdata'=>$data]);
     

   }

}