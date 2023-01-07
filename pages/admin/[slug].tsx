import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { auth, firestore, serverTimestamp } from "../../lib/firebase";

import { useState } from "react"
import { useRouter } from "next/router"

import { useDocumentData } from "react-firebase-hooks/firestore"
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import ReactMarkdown from "react-markdown";
import Link from 'next/link';
import { toast } from "react-hot-toast";


export default function AdminPostEdit({ }) {
	return (
		<AuthCheck>
			<PostManager />
		</AuthCheck>
	);
}

function PostManager() {
	const [preview, setPreview] = useState(false);

	const router = useRouter();
	const { slug } = router.query;

	const postRef = firestore
		.collection('users')
		.doc(auth.currentUser.uid)
		.collection('posts')
		.doc(slug.toString());

	const [post] = useDocumentData(postRef);
	// turn off realtime updates with useDocumentDataOnce hook instead

	return (
		<main className={styles.container}>
			{post && (
				<>
					<section>
						<h1>{post.title}</h1>
						<p>ID: {post.slug}</p>

						<PostForm postRef={postRef} defaultValues={post} preview={preview} />
					</section>

					<aside>
						<h3>Tools</h3>
						<button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
						<Link href={`/${post.username}/${post.slug}`}>
							<button className="btn-blue">Live View</button>
						</Link>
					</aside>
				</>
			)}
		</main>

	);
}


function PostForm({ defaultValues, postRef, preview }) {
	const { 
		register, 
		handleSubmit, 
		reset, 
		watch, 
		formState, 
		formState: { errors } 
	} = useForm({ defaultValues, mode: 'onChange' });

	const { isValid, isDirty } = formState;

	const updatePost = async ({ content, published }) => {
		await postRef.update({
			content,
			published,
			updatedAt: serverTimestamp(),
		});

		reset({ content, published });

		toast.success('Post updated successfully!')
	}

	return (
		<form onSubmit={handleSubmit(updatePost)}>
			{preview && (
				<div className="card">
					<ReactMarkdown>{watch('content')}</ReactMarkdown>
				</div>
			)}

			<div className={preview ? styles.hidden : styles.controls}>

				<textarea name="content" {...register('content', {
					maxLength: {value: 20000, message: 'content is too long'},
					minLength: {value: 10, message: 'content is too short' },
					required: {value: true, message: 'content is required' },
				})}></textarea>

				<ErrorMessage errors={errors} name="content" render={({message}) => <p className='text-danger'>{ message }</p>}/>

				<fieldset>
					<input className={styles.checkbox} name="published" type="checkbox" {...register('published')} />
					<label>Published</label>
				</fieldset>

				<button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
					Save Changes
				</button>
			</div>

		</form>
	);
}


