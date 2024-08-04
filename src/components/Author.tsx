import React from 'react'
import { Box, Card } from '@mui/material'
import '../App.css';

const Author: React.FC = () => {
  return (
    <Box className='item-width'>
      <Card className='item-bg author'>
        <ul>
          <li>Author: <a href="https://github.com/masa0902dev" target='_blank' rel="noopener noreferrer">masa0902dev</a></li>
          <li>Github: <a href="https://github.com/masa0902dev/fe-learning-graph-with-notion" target='_blank' rel="noopener noreferrer">fe-learning-graph-with-notion</a></li>
          <li>TechBlog: <a href="https://www.notion.so/masa0902dev/Tech-Blog-MASA-0f225d11627944d692699daf0686cd9e" target='_blank' rel="noopener noreferrer">Notion Blog</a></li>
        </ul>
      </Card>
    </Box>
  )
}
export default Author
