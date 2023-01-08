import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";

import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from 'lodash.kebabcase';
import { toast } from "react-hot-toast";
import { Query } from "firebase/firestore";

export default function AdminPostsPage(props) {
		return (
				<main>
						<AuthCheck>
								<PostList />
								<CreateNewPost />
						</AuthCheck>
				</main>
		)
}

function PostList() {
		const ref = firestore
				.collection('users')
				.doc(auth?.currentUser?.uid)
				.collection('posts');

		console.log(typeof ref)

		const query: Query | any = ref.orderBy('createdAt');
		console.log(typeof query)
		console.log(query)

		const [querySnapshot] = useCollection(query);

		const posts = querySnapshot?.docs.map((doc) => doc.data());

		return (
				<>
						<h1>Manage your Posts</h1>
						<PostFeed posts={posts} admin />
				</>
		)
}

function CreateNewPost() {
		const router = useRouter();
		const { username } = useContext(UserContext);
		const [title, settitle] = useState<string>('');

		//  Ensure slug is URL safe
		const slug = encodeURI(kebabCase(title));

		const isValid = title.length > 3 && title.length < 100;

		const createPost = async (e) => {
				e.preventDefault();
				const uid = auth.currentUser.uid;
				const ref = firestore.collection('users')
						.doc(uid)
						.collection('posts')
						.doc(slug)

				const data = {
						title,
						slug,
						uid,
						username,
						published: false,
						content: '# hello world',
						createdAt: serverTimestamp(),
						updatedAt: serverTimestamp(),
						heartCount: 0,
				};

				await ref.set(data);

				toast.success('Post created!');

				router.push(`/admin/${slug}`);

		}

		return (

				<form onSubmit={createPost}>
						<input
								value={title}
								onChange={(e) => settitle(e.target.value)}
								placeholder="My Awesome Article!"
						/>
						<p>
								<strong>Slug:</strong> {slug}
						</p>
						<button type="submit" disabled={!isValid} className="btn-green">
								Create New Post
						</button>
				</form>

		);
}