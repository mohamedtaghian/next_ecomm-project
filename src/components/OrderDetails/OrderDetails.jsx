import Link from "next/link";

export default function OrderDetails({ order }) {
  const date = new Date(order.createdAt);

  return (
    <div className="p-6 border border-dashed border-slate-300 rounded-xl">
      <header className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 pb-6 border-b border-dashed border-slate-300">
        <div className="text-dark-primary">
          <span className="font-semibold">Transaction Number</span>
          <span className="mx-1">:</span>
          <span>#{order.id}</span>
        </div>
        <div className="text-dark-primary">
          <span className="font-semibold">Placed on</span>
          <span className="mx-1">:</span>
          <span>{date.toLocaleDateString("en-US")}</span>
        </div>
        <div className="text-dark-primary">
          <span className="font-semibold">Payment </span>
          <span className="mx-1">:</span>
          <span>{order.paymentMethodType}</span>
        </div>
        <Link
          href="/products"
          className="bg-primary text-sm text-white py-1 px-3 rounded-sm cursor-pointer hover:bg-dark-primary duration-300"
        >
          Add New Items
        </Link>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-8">
        {order.cartItems.map((item) => (
          <article key={item._id} className="flex items-center gap-6">
            <div className="w-[150px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover" src={item.product.imageCover} alt={item.product.title} />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <Link
                href={`/product-details/${item.product._id}`}
                className="line-clamp-1 font-medium text-dark-primary hover:text-primary duration-300"
              >
                {item.product.title}
              </Link>
              <p>
                <span className="text-dark-primary">Price</span>
                <span className="mx-1 text-dark-primary">:</span>
                <span className="text-primary">EGP {item.price}</span>
              </p>
              <p>
                <span className="text-dark-primary">Quantity</span>
                <span className="mx-1 text-dark-primary">:</span>
                <span className="text-primary">{item.count}</span>
              </p>
              <p className="text-gray-500 text-sm">{item.product.category.name}</p>
              <p className="text-gray-500 text-sm">{item.product.brand.name}</p>
            </div>
          </article>
        ))}
      </div>
      <footer className="mt-5 flex flex-col gap-2 items-center justify-center">
        <p className="font-semibold">
          <span className="text-dark-primary">Products Quantity</span>
          <span className="mx-1 text-dark-primary">:</span>
          <span className="text-primary">{order.cartItems.length}</span>
        </p>
        <p className="font-semibold">
          <span className="text-dark-primary">Shipping Price</span>
          <span className="mx-1 text-dark-primary">:</span>
          <span className="text-primary">EGP {order.shippingPrice}</span>
        </p>
        <p className="font-semibold">
          <span className="text-dark-primary">Taxes</span>
          <span className="mx-1 text-dark-primary">:</span>
          <span className="text-primary">EGP {order.taxPrice}</span>
        </p>
        <p className="font-semibold text-2xl">
          <span className="text-dark-primary">Total Order Price </span>
          <span className="mx-1 text-dark-primary">:</span>
          <span className="text-primary text-xl">EGP {order.totalOrderPrice}</span>
        </p>
      </footer>
    </div>
  );
}
