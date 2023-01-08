import PostContent from '../../components/PostContent';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import AuthCheck from '../../components/AuthCheck';
import HeartButton from '../../components/HeartButton';
import Link from 'next/link';
import { DocumentReference } from 'firebase/firestore';

// tutorial version
// this version wasn't working at first
// because I had saved the post documents with randomly generated ids for names
// but the ids needed to be camel-case-versions of the article title, the same as the slug
export async function getStaticProps({ params }) {
  const userDoc = await getUserWithUsername(params.username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref
    .collection('posts')
    .doc(params.slug)

    post = postToJSON(await postRef.get());

    path = postRef.path;
  }
  
  return {
    props: { post, path },
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
  // hydration, real time listening to the database
  // updates heart count and content in real time
  const postRef: DocumentReference | any = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);
  const post = realtimePost || props.post;
  
  return (
    <main>

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} {' '} 💗</strong>
        </p>

        <AuthCheck 
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef}/>
        </AuthCheck>
      </aside>
      
    </main>
  );
}
