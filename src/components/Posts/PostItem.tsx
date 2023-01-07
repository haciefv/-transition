import { Flex, Icon,Stack,Text,Image, Skeleton, Alert, AlertIcon, Link } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Post } from '../../atoms/postsAtom';
import {
    IoArrowDownCircleOutline,
    IoArrowDownCircleSharp,
    IoArrowRedoOutline,
    IoArrowUpCircleOutline,
    IoArrowUpCircleSharp,
    IoBookmarkOutline,
  } from "react-icons/io5";
import moment from 'moment';
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from 'react-icons/bs';
import { BiLike } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { BiUser } from 'react-icons/bi';

type PostItemProps = {
    post:Post;
    userIsCreator:boolean;
    userVoteValue?:number
    onVote: (event:React.MouseEvent<HTMLDivElement,MouseEvent>,
        post:Post, vote:number,communityId:string)=>void;
    onDeletePost: (post:Post)=>Promise<boolean>;
    onSelectPost?: (post:Post)=>void;
    homePage?:boolean;
    
};

const PostItem:React.FC<PostItemProps> = (
    { post,     
      userIsCreator ,
      userVoteValue ,
      onVote ,
      onDeletePost ,
      onSelectPost ,
      homePage
    }
    ) => {
    const [loadingImage,setLoadingImage]=useState(true)
    const [loadingDelete,setLoadingDelete]=useState(false)
    const router = useRouter(); 
    const singlePostPage = !onSelectPost
        
    const [error,setError]=useState(false)

    console.log(userVoteValue)

    const handleDelete =async (event:React.MouseEvent<HTMLDivElement,MouseEvent>
        ) => {
        try {
            event.stopPropagation()
            const success= await onDeletePost(post)
            if (!success){
                throw new Error ("Failed to delete post")
            }
            if (singlePostPage){
                router.push(`/r/${post.communityId}`)
            }
            console.log("Post was succesfully deleted")
        } catch (error:any) {
            console.log("handleDelete error" ,error.message)
            setError(error.message)
        }
        
    }

    return(
        <Flex 
        border = "1px solid" 
        bg = "white"
        borderColor={singlePostPage?"white":"gray.300"}
        borderRadius={singlePostPage?"4px 4px 0px 0px":"4px"}
        _hover={{borderColor:singlePostPage?"none":"gray.500"}}
        cursor={singlePostPage?"unset":"pointer"}
        onClick={()=> onSelectPost && onSelectPost(post)}
        >
            {/* <Flex 
            direction="column" 
            align="center" 
            bg = {singlePostPage?"none":"gray.100"}
            p={2} width="40px" 
            borderRadius={singlePostPage?"0":"3px 0px 0px 3px"}
            >
                <Icon as ={userVoteValue===1? IoArrowUpCircleSharp:IoArrowUpCircleOutline }
                color={userVoteValue===1?"brand.100":"gray.400"}
                fontSize={22}
                onClick={( event)=>onVote(event,post,1,post.communityId)}
                cursor="pointer"
                />
                <Text fontSize="9pt">{post.voteStatus}</Text>
                <Icon as ={userVoteValue===-1? IoArrowDownCircleSharp:IoArrowDownCircleOutline }
                color={userVoteValue===-1?"#4379ff":"gray.400"}
                fontSize={22}
                onClick={( event)=>onVote(event,post,-1,post.communityId)}
                cursor="pointer"
                />
            </Flex> */}
            <Flex p={3} direction="column" width="100%">
            {error&&(
                <Alert status='error'>
                <AlertIcon />
                <Text mr={2}>Your browser is outdated!</Text>
              </Alert>
            )}

                <Stack>
                   <Stack 
                   direction="row" 
                   spacing={0.6}
                   align="center"
                   fontSize="9pt"
                   >
                       {homePage && (
                        <>
                            {post.communityimageURL?(
                                <Image 
                                alt='sa'
                                src={post.communityimageURL} 
                                borderRadius ="full"
                                boxSize="18px"
                                mr={2}  />
                            ):(<Icon as={BiUser} 
                            fontSize="18pt" 
                            mr={1}
                            color="blue.500"
                            />)}
                            <Link href={`r/${post.communityId}`}>
                                <Text 
                                onClick={(event)=>event.stopPropagation()}
                                fontWeight={700}
                                _hover={{textDecoration:"underline"}}>

                                    {`${post.communityId}`}
                                </Text>
                                </Link>
                            <Icon as={BsDot} color="gray.500" fontSize="18pt" mr={1}/>
                        </>
                       )}
                       <Text color="gray.500">
                         Posted by {post.creatorDisplayName}{" "}
                         {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
                        </Text>
                   </Stack>
                   <Text fontSize="12t" fontWeight={600}>
                      {post.title}
                   </Text>
                   <Text fontSize="10pt">{post.body}</Text>
                   {post.imageURL&&(
                    <Flex justify="center" align="center"p={2} >
                        {loadingImage&&(<Skeleton height="200px" width="100%" borderRadius={4} /> )}
                        <Image 
                        src={post.imageURL} 
                        maxHeight="460px" 
                        alt="Post Image"
                        display={loadingImage?"none":"unset"}
                        onLoad={()=>setLoadingImage(false)} />
                    </Flex>
                   )}
                </Stack>

                <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
                <Flex 
                    
                    align="center" 
                    p="8px 10px"
                    borderRadius={4}
                    _hover={{bg:"gray.200"}}
                    cursor="pointer"
                    // onClick={handleDelete}
                        onClick={( event)=>onVote(event,post,1,post.communityId)}
                    >
                        <Icon 
                        color={userVoteValue===1?"blue.400":"gray.500"} 
                        as ={BiLike} mr={2}
                        />
                        <Text 
                        color={userVoteValue===1?"blue.400":"gray.500"} 
                        fontSize="9pt" pr={1}>{post.voteStatus} </Text> 
                        <Text 
                        color={userVoteValue===1?"blue.400":"gray.500"} 
                        fontSize="9pt" >Likes</Text>
                    </Flex>

                    <Flex 
                    align="center" 
                    p="8px 10px"
                    borderRadius={4}
                    _hover={{bg:"gray.200"}}
                    cursor="pointer"
                    >
                        <Icon as ={BsChat} mr={2}/>
                        <Text fontSize="9pt" >{post.numberOfComments}</Text>
                    </Flex>
                    <Flex 
                    align="center" 
                    p="8px 10px"
                    borderRadius={4}
                    _hover={{bg:"gray.200"}}
                    cursor="pointer"
                    >
                        <Icon as ={IoArrowRedoOutline} mr={2}/>
                        <Text fontSize="9pt" >Share</Text>
                    </Flex>
                    <Flex 
                    align="center" 
                    p="8px 10px"
                    borderRadius={4}
                    _hover={{bg:"gray.200"}}
                    cursor="pointer"
                    >
                        <Icon as ={IoBookmarkOutline} mr={2}/>
                        <Text fontSize="9pt" >Save</Text>
                    </Flex>
                    {userIsCreator &&(
                        
                    <Flex 
                    align="center" 
                    p="8px 10px"
                    borderRadius={4}
                    _hover={{bg:"gray.200"}}
                    cursor="pointer"
                    onClick={handleDelete}
                    >
                        <Icon as ={AiOutlineDelete} mr={2}/>
                        <Text fontSize="9pt" >Delete</Text>
                    </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    )
}
export default PostItem;