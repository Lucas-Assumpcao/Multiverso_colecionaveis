import { classNames } from './classNames';

function Container({ as: Element = 'div', className, children, ...props }) {
  return (
    <Element
      className={classNames('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </Element>
  );
}

export default Container;
