This repo is a front end for an e-commerce website. This front end will connect to a back end API which is hosted on Render and uses a MongoDB database hosted on MongoDB Atlas.

The front end is built with React, Vite, React Router, Shadcn UI, Tailwind.

Payments are handled with Stripe and the checkout page is handed off to Stripe's secure checkout page.

Email is handled with Resend.

The front end is hosted on Netlify.

The front end will have a store for customers and a dashboard for admins to manage products, orders, customers, etc.

Auth is handled via JWT tokens. Admins have an 'isAdmin' property in their JWT tokens.



## Website Sitemap

### Main Navigation (Store)

1.	Home Page
    - The central landing page of the website.
    - Displays promotional materials, CSS styling, and links to other sections of the site.

2.	Catalog Page
    - Displays a list of products available for purchase.
    - Users can filter products by category or search for specific items.

3.	Product Page
    - Provides detailed information about a specific product.
    - Includes options to add the product to the shopping cart.

4.	Search Input Overlay
    - Allows users to search for products on the website.
    - Results are displayed in the Results Page.

5.	Results Page
    - Displays products matching the user’s search query.

6.	Cart Overlay
    - Displays a summary of all items added to the guest’s shopping cart.

7.	Checkout Page
    - Hand over to Stripe tp complete the purchase process.
    - Requires a JWT token to access, otherwise send to Auth page to login/create account.

8.	Auth Page
    - Allows users to log in to their account or register for a new one.

9.	Account/App Options Overlay
    - Displays options for managing the user account and application-related settings.
    - Subsections include:
    - Account Settings Overlay
    - Enables users to modify personal information, view saved addresses, and change account details.
    - My Orders Page
    - Displays the user’s past orders, including order details.
    - Logout Page
    - Allows users to log out and redirects them to the home page.

### Admin Dashboard (Requires JWT & Admin Role)

- Accessible only to users with Admin permissions.
- Includes a dedicated navigation menu for managing store resources and user data.

1.	Orders Page
    - Lists all orders placed by customers.
    - Includes functionalities for reviewing, filtering, and processing orders.
    - Overlays:
    - View Order Details Overlay
    - Displays additional information about a specific order when selected.

2.	Products Page
    - Lists all products available in the store.
    - Includes tools for managing inventory, adding new products, and editing product details.
    - Overlays:
    - View Product Details Overlay
    - Displays additional details about a specific product.
    - Edit Product Details Overlay
    - Allows for modifications to product information, including pricing, descriptions, and inventory levels.

3.	Customers Page
    - Displays a list of all registered customers.
    - Admins can view and manage customer profiles.
    - Overlays:
    - View Customer Details Overlay
    - Provides additional details about a specific customer.
    - Edit Customer Details Overlay
    - Allows admins to update customer information, such as contact details or account status.

4.	Search Overlay
    - Allows admins to quickly search for orders, products, or customers.
    - Results display relevant data from the admin dashboard.
