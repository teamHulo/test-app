import { useActionData, useLoaderData, useSubmit, Form } from "@remix-run/react";
import { Grid, Page, Card, Image } from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";



export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
      {
        products(first: 250) {
          nodes {
            title
            description
            id
            images(first:1) {
                nodes {
                  src
                }
              }
          }
        }
      }`);
  console.log("*************************************************************");

  
  const {
    data: {
      products: { nodes },
    },
  } = await response.json();

  return json(nodes);
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request); 
  const formDate = await request.formData();
  const title = formDate.get('title');
  console.log("////////////////////////////////////////////////:" + title);


  const response = await admin.graphql(`
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }
  `,
  {
    variables: {
      input: {
        title: title,
        variants: [{ price: Math.random() * 100 }],
      },
    },
  },);
  const responseJson = await response.json();

  return json(responseJson);
}



const Test = () => {
  const [openForm, setOpenForm] = useState(false);
  const load = useLoaderData();

  const actionData = useActionData();
  

  
  const handleAction = useCallback(() => {
    setOpenForm(openForm => !openForm);
  }, []);


  return (
    <Page fullWidth>
        
      <button onClick={ handleAction }>
          Create Product
      </button>
      {openForm && (
        <Form method="post">
            <input
              name="title"
              type="text"
              onChange={handleTitleChange}
            />
            <button type="submit" > Add Product</button>
        </Form>
      )}
      <Grid>
        <Grid.Cell columnSpan={{ xs: 2, sm: 2, md:3, lg: 3, xl: 3 }}>
          <p>image</p>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 2, sm: 2, md:3, lg: 3, xl: 3  }}>
          <p>id</p>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 2, sm: 2, md:3, lg: 3, xl: 3  }}>
          <p>title</p>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 2, sm: 2, md:3, lg: 3, xl: 3  }}>
          <p>description</p>
        </Grid.Cell>
      </Grid>
      <Grid>
        {load.map((product) => (
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 12, lg: 12, xl: 12 }} key={product.id}>
            <Card title={product.title} sectioned >
              <Grid>
                <Grid.Cell columnSpan={{ xs: 2, sm: 2, md: 3, lg: 3, xl: 3 }}>
                  {
                    product.images.nodes.map((img, i) => <Image width="150" height="150" source={ img.src} style={{ objectFit:'cover'}} key={i}></Image>)
                  }
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 2, sm: 2, md: 3, lg: 3, xl: 3 }}>
                  <p>{product.id}</p>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 2, sm: 2, md: 3, lg: 3, xl: 3 }}>
                  <p>{product.title}</p>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 2, sm: 2, md: 3, lg: 3, xl: 3 }}>
                  <p>{product.description}</p>
                </Grid.Cell>
              </Grid>
            </Card>
          </Grid.Cell>
        ))}
      </Grid>
    </Page>
  );
};

export default Test;
