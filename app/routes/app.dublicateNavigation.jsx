import { Button, Page } from "@shopify/polaris"
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit, Form } from "@remix-run/react";
export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    const article =  await admin.rest.resources.Article.all({
        session: session,
        blog_id: 89347719399,
      });
    console.log('///////////////////////////////////////////////////////////////////////////////////////////'); 
    console.log(article);
    return json(article);
};

export const action = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);

    const article = new admin.rest.resources.Article({session: session});

    article.blog_id = 89347719399;
    article.title = "My new Article title";
    article.author = "John Smith";
    article.tags = "This Post, Has Been Tagged";
    article.body_html = "<h1>I like articles</h1>\n<p><strong>Yea</strong>, I like posting them through <span class=\"caps\">REST</span>.</p>";
    article.published_at = "Thu Mar 24 15:45:47 UTC 2011";
    await article.save({
    update: true,
    });

    return json({status:200});
}


const DublicateNavigation = () => {
    const load = useLoaderData();
    const action = useActionData();
    const submit = useSubmit();
    const generateBlog = () => submit({}, { replace: true, method: "POST" });
    return(
        <Page fullWidth>
            <Button onClick={ generateBlog }> Dublicate Menu</Button>
            { load.data.map(article => <p>{article.id}</p>)}
        </Page>
    )
}

export default DublicateNavigation;