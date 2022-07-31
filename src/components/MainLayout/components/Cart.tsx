import Badge from "@material-ui/core/Badge";
import CartIcon from "@material-ui/icons/ShoppingCart";
import IconButton from "@material-ui/core/IconButton";
import React, { useEffect } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, updateFromApi } from "store/cartSlice";
import { Link } from 'react-router-dom';
import API_PATHS from "../../../constants/apiPaths";

export default function Cart() {
  const dispatch = useDispatch();
  useEffect(() => {
    const load = async () => {
      const {
        data: { data },
      } = await axios.get(`${API_PATHS.cart}/profile/cart`);
      const { cart } = data;
      dispatch(updateFromApi(cart));
    };
    load();
  }, [dispatch]);
  const cartItems = useSelector(selectCartItems);
  const badgeContent = cartItems.length || undefined;

  return (
    <IconButton
      aria-label="show 4 new mails"
      color="inherit"
      component={Link}
      to="/cart"
    >
      <Badge badgeContent={badgeContent} color="secondary">
        <CartIcon/>
      </Badge>
    </IconButton>
  );
}
