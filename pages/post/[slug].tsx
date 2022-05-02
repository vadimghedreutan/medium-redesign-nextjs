import { useState } from 'react'
import { GetStaticProps } from 'next'
import Header from '../../components/Header'
import Moment from 'react-moment'
import { sanityClient, urlFor } from '../../sanity'
import PortableText from 'react-portable-text'
import { Post } from '../../typing'
import { useForm, SubmitHandler } from 'react-hook-form'

interface FormInput {
  _id: string
  name: string
  email: string
  comment: string
}

interface Props {
  post: Post
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>()

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data)
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }

  const uppercase = (something: String) => {
    const arr = something.split(' ')

    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
    }

    return arr.join(' ')
  }

  return (
    <main>
      <Header />

      <article className="mx-auto max-w-3xl p-5">
        <div className="flex items-center space-x-2">
          <img
            src={urlFor(post.author.image).url()!}
            alt=""
            className="h-12 w-12 rounded-full"
          />
          <div>
            <h3>{uppercase(post.author.name)}</h3>
            <p className="text-sm text-gray-400">
              <Moment format="ll">{post._createdAt}</Moment>
            </p>
          </div>
        </div>
        <img src={urlFor(post.mainImage).url()!} alt="" className="mt-6 mb-3" />

        <div>
          <h1 className="mt-10 mb-3 text-3xl font-bold">{post.title}</h1>
          <h2 className="mb-3 text-xl text-gray-400">{post.description}</h2>
        </div>

        <div>
          <PortableText
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h3: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              blockquote: (props: any) => (
                <blockquote
                  className="quote mt-4 border-l-4 border-yellow-400 bg-neutral-100 p-5 italic text-neutral-600"
                  {...props}
                />
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      {submitted ? (
        <div className="my-10 mx-auto flex max-w-3xl flex-col bg-green-500 p-8 text-white">
          <h3 className="text-2xl font-semibold">
            Thank you for submitting your comment
          </h3>
          <p>Once it has approved, it will appear below!</p>
        </div>
      ) : (
        <form
          className="my-10 mx-auto mb-10 flex max-w-2xl flex-col p-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-green-500">Enjoyed this article?</h3>
          <h4 className="text-2xl">Leave a comment below!</h4>
          <hr className="mt-2 py-3" />

          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring-2"
              type="text"
              placeholder="John Doe"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring-2"
              type="email"
              placeholder="John Doe"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring-2"
              placeholder="John Doe"
              rows={8}
            />
          </label>

          {/* form field validation */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-xs text-red-500">
                - The Name Field is required
              </span>
            )}
            {errors.comment && (
              <span className="text-xs text-red-500">
                - The Comment Field is required
              </span>
            )}
            {errors.email && (
              <span className="text-xs text-red-500">
                - The Email Field is required
              </span>
            )}
          </div>

          <input
            type="submit"
            className="w-fit cursor-pointer rounded-full bg-green-600 px-12 py-2 
        text-white shadow transition duration-100 hover:bg-green-500 "
          />
        </form>
      )}
      {/* Comments */}
      <div className="my-10 mx-auto flex max-w-3xl flex-col p-8 ">
        <h3 className="pb-2 text-2xl font-semibold">
          Comments: ({post.comments.length})
        </h3>
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="pr-1 text-green-500"> {comment.name}:</span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == 'post']{
    _id,
    slug {
    current
  }
  }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == 'post' && slug.current == $slug][0]{
    _id,
    _createdAt,
      title,
      description,
      author -> {
      name,
      image
    },
    'comments': *[
      _type == "comment" && 
      post._ref == ^._id &&
      approved == true
    ],
    mainImage,
    slug,
    body
  }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
