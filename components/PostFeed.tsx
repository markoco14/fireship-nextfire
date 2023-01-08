import Link from 'next/link';

export default function PostFeed({ posts, admin }) {
	return posts?.map((post) => <PostItem post={post} key={post.slug} admin={admin}/>);
}

function PostItem({ post, admin }) {

	const wordCount = post?.content.trim().split(/\s+/g).length;
	const mintuesToRead = (wordCount / 100 + 1).toFixed(0);

	return (
		<div className="card">
			<Link href={`/${post.username}`}>
				By @{post.username}
			</Link>
			{admin ? 
				(
					<Link href={`/admin/${post.slug}`}>
						<h2>
							{post.title}
						</h2>
					</Link>
				) 
				: 
				(
					<Link href={`/${post.username}/${post.slug}`}>
						<h2>
							{post.title}
						</h2>
					</Link>
				)
			}
			<footer>
				<span>
					{wordCount} words. {mintuesToRead} min read
				</span>
				<span> &#10084; {post.heartCount} Hearts</span>

			</footer>
		</div>
	);
}