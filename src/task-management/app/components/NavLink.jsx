import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Link from 'next/link'
import React, { Children } from 'react'
import Icon from './Icon';

const NavLink = ({ children, glyph, ...props }) => {
  const { asPath, isReady } = useRouter();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL(props.as || props.href, location.href)
        .pathname

      // Using URL().pathname to get rid of query and hash
      const activePathname = new URL(asPath, location.href).pathname

      const newIsActive = linkPathname === activePathname;
      console.log(newIsActive, glyph)
      if (isActive !== newIsActive) {
        setIsActive(newIsActive)
      }
    }
  }, [
    asPath,
    isReady,
    props.as,
    props.href,
    setIsActive,
    isActive,
  ])

  const color = isActive ? 'black' : 'gray';

  return (
    <Link {...props}>
      <li className={`h-10 first:mt-0 mt-4 cursor-pointer items-center flex text-${color}`}>
        <Icon glyph={glyph} />
        <a className="ml-4">{children}</a>
        {isActive && <div className="w-1 rounded-tl-lg rounded-bl-lg rounded-b-1 h-10 bg-black ml-auto" />}
      </li>
    </Link>
  )
}

export default NavLink;