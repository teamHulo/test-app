import { authenticate } from "../shopify.server";
import db from "../db.server";


const createArticle = async (id, value, admin, session) => {
  
  const article = new admin.rest.resources.Article({session: session});
  article.blog_id = id;
  article.title = value ;
  await article.save({
    update: true,
  })
}




const loadData = async (admin, session, payload) => {
  const { line_items }  = payload;
  const blog = await db.Blog.findFirst({
    where:{
      shop: session.shop
    }
  });

  const properties = line_items.map(data => data.properties).flat().filter( word => word.name === 'custom');
  
  return properties.length ? Promise.all(properties.map( element => createArticle(blog.blog_id, element.value, admin, session))) : null;   
  
  
}



export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload} = await authenticate.webhook(request);
  let res = await request;
  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }


  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    case "PRODUCTS_UPDATE":
      console.log('product update');
      break;
    case "ORDERS_PAID":
      loadData(admin, session, payload);
      
      break;  
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};


