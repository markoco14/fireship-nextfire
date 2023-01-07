import PostContent from '../../components/PostContent';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';

import { useDocumentData } from 'react-firebase-hooks/firestore';

// tutorial version
// export async function getStaticProps({ params }) {
//   const userDoc = await getUserWithUsername(params.username);

//   let post;
//   let path;

//   if (userDoc) {
//     const postRef = userDoc.ref
//     .collection('posts')
//     .doc(params.slug)

//     post = postToJSON(await postRef.get());

//     path = postRef.path;
//   }
  
//   return {
//     props: { post, path },
//     revalidate: 5000,
//   };
// }

// my version
export async function getStaticProps({ params }) {
    const userDoc = await getUserWithUsername(params.username);

    let posts;
    let post;

    if (userDoc) {
      const postQuery = userDoc.ref
      .collection('posts')
      .where('slug', '==', params.slug)

      posts = (await postQuery.get()).docs.map(postToJSON);
      post = posts[0];
      // console.log(post)
    }
    
    return {
      props: { post, path: 'posts/my-next-big-article' },
      revalidate: 5000,
    };
}

export async function getStaticPaths() {
  // Improve by using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup('posts').get();
  
  const paths = snapshot.docs.map((doc) => {
    const { username, slug } = doc.data();
    return {
      params: { username, slug },
    };
  });
  
  return {
    // must be in this format:
    // paths: [
      // {params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}


export default function Post(props) {
  // console.log(props.post.content)

  // we only need to pass a path object
  // if we want to get a real time post
  // in case it has changed or something?
  // so the path is allowing hydration - reacting to realtime data
  // so when likes increase for example
  // but also when the content is changed?
  // const postRef = firestore.doc(props.path);
  // const [realtimePost] = useDocumentData(postRef);
  // const post = realtimePost || props.post;

  // temporary fix to firestore problems
  // no hyrdation
  // probably have to re-render the page to get realtime hearts...
  // lets see
  // but I could also manage some state in the front-end to fake the hearts.
  // the post content doesn't need to change in realtime
  const post = props.post
  
  return (
    <main>

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} {' '}&#10084;</strong>
        </p>
      </aside>
      
    </main>
  );
}
