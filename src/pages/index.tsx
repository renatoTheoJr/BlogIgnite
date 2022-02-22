import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import  Prismic  from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

 export default function Home(props:PostPagination) {

  return (
    <>
    <h1>teste</h1>
    </>
  )
    
 }

 export const getStaticProps : GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postResponse = await prismic.query([
      Prismic.predicates.at('document.type', 'posts')
      ],{
          fetch:['posts.title', 'posts.author', 'posts.subtitle', 'next_page'],
          pageSize: 20,
      })
  const posts = postResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_data: new Date(post.first_publication_date).toLocaleDateString('pt-br',{
          day: '2-digit',
          month: 'long',
          year: 'numeric'
      }),
      data:{
        title: post.data.title,
        author: post.data.author,
        subtitle: post.data.subtitle
      }
    }

  })
  

  return {
    props: {
      postPagination: {
        results: posts,
        next_page: postResponse.next_page
      }
    }
  }

};
