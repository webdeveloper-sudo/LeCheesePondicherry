import React from 'react'
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { LogOut, Settings, MapPin, Star, ShoppingBag } from "lucide-react";
import { orderAPI } from "@/lib/api";
import YourPicks from "../../components/YourPicks";
import OrderHistory from '@/components/OrderHistory';

const YourOrders = () => {
  return (
    <div className=' container'>
        <OrderHistory/>
    </div>
  )
}

export default YourOrders;


 