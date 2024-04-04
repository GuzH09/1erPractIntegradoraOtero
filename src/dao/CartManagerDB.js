import cartModel from "./models/cartModel.js";

export default class CartManagerDB {
    async getCarts() {
        try {
            const carts = await cartModel.find().lean();
            const cartsWithStrIds = carts.map(cart => {
                return {
                    ...cart,
                    _id: cart._id.toString()
                };
            });
            return cartsWithStrIds;
        } catch (error) {
            return {error: error.message};
        }
    }

    async getCartById(id) {
        const cart = await cartModel.findOne({_id: id}).lean();
        if (cart) {
            return cart;
        } else {
            return {error: "That cart doesn't exists."};
        }
    }

    async addCart() {
        try {
            const result = await cartModel.create({});
            return {success: "Cart added."};
        } catch (error) {
            return {error: error.message};
        }
    }

    async AddProductToCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);

            if (cart.error) {
                return {error: cart.error};
            }

            // Check if the product already exists in the cart
            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex === -1) {
                // If the product doesn't exist, add it with quantity 1
                cart.products.push({ product: productId, quantity: 1 });
                const result = await cartModel.updateOne({ _id: cartId }, { products: cart.products });
                return {success: `Product ${productId} added on cart ${cartId}.`};
            } else {
                // If it already exists, quantity should go up by 1
                cart.products[productIndex].quantity++;
                const result = await cartModel.updateOne({ _id: cartId }, { products: cart.products });
                return {success: `Added on more product ${productId} on cart ${cartId}.`}
            }
        } catch (error) {
            return {error: error.message}
        }
    }
}