export default function Footer() {
  return (
    <footer className="bg-main-light py-10 px-5">
      <div className="container">
        <h2 className="text-2xl font-bold text-dark-primary">
          Get the FreshCart App
        </h2>
        <p className="my-2 text-gray-500">
          We will send you a link, open it on your phone to download the app
        </p>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <input
            type="email"
            placeholder="Email..."
            className="w-full md:w-0 flex-grow bg-white py-1 px-2 rounded-sm border-2 border-dark-primary focus:outline-0 focus:border-primary duration-150 caret-dark-primary text-dark-primary"
          />
          <button className="bg-primary py-2 px-6 rounded-sm text-sm text-white hover:bg-dark-primary duration-300 cursor-pointer">
            Share App Link
          </button>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-2 mt-8 border-y py-4 border-slate-200">
          <div className="partners flex gap-2.5 md:gap-4 items-center">
            <h2 className="text-sm md:text-base text-dark-primary">Payment Partners</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-10 md:w-16" src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Pay" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-10 md:w-16" src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-10 md:w-16" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="MasterCard" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-10 md:w-16" src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
          </div>
          <div className="partners flex gap-4 items-center">
            <h2 className="text-sm md:text-base text-dark-primary">Get deliveries with FreshCart</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-12 md:w-24" src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Apple Store" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-12 md:w-24" src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
          </div>
        </div>
      </div>
    </footer>
  );
}
