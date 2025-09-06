import { useCallback, useLayoutEffect, useRef } from 'react';

export type RegisteredComponent<T> = {
  _type?: T;
  typeKey: symbol;
  instanceKey?: symbol;
};

export function registeredComponentType<T>(name?: string): RegisteredComponent<T> {
  return { typeKey: Symbol(name) };
}

export function registeredComponent<T>(type: RegisteredComponent<T>): RegisteredComponent<T> {
  return { ...type, instanceKey: Symbol() };
}

export type RegisterManager = {
  getByType: <T>(type: RegisteredComponent<T>) => T[];
  register: <T>(component: RegisteredComponent<T>, data: T) => symbol;
  unregister: (registerKey: symbol) => void;
};

type ComponentRegistration<T> = { component: RegisteredComponent<T>; data: T };

export const componentsChangedListener = registeredComponentType<() => void>('componentsChangedListener');

export function useRegisterManager(): RegisterManager {
  const componentsByRegisterKey = useRef<{
    [registerKey: symbol]: ComponentRegistration<any>;
  }>({});
  const componentsByInstanceKey = useRef<{
    [instanceKey: symbol]: ComponentRegistration<any>;
  }>({});
  const componentsByTypeKey = useRef<{
    [typeKey: symbol]: { [registerKey: symbol]: ComponentRegistration<any> };
  }>({});

  const getByType = useCallback<RegisterManager['getByType']>((type) => {
    const byMyTypeKey = componentsByTypeKey.current[type.typeKey];
    return byMyTypeKey ? Object.getOwnPropertySymbols(byMyTypeKey).map((key) => byMyTypeKey[key].data) : [];
  }, []);

  const register = useCallback<RegisterManager['register']>(
    (component, data) => {
      console.log(`register ${component.typeKey.description ?? '-'}`);
      const registration = { component, data };
      const registerKey = Symbol();

      if (component.instanceKey) {
        if (componentsByInstanceKey.current[component.instanceKey]) {
          throw new Error('There is more than one component using the same instanceKey');
        }
        componentsByInstanceKey.current[component.instanceKey] = registration;
      }

      let byMyTypeKey = componentsByTypeKey.current[component.typeKey];
      if (!byMyTypeKey) {
        componentsByTypeKey.current[component.typeKey] = byMyTypeKey = {};
      }
      byMyTypeKey[registerKey] = registration;

      componentsByRegisterKey.current[registerKey] = registration;

      getByType(componentsChangedListener).forEach((l) => l());
      return registerKey;
    },
    [getByType]
  );

  const unregister = useCallback<RegisterManager['unregister']>(
    (registerKey) => {
      const registration = componentsByRegisterKey.current[registerKey];
      if (!registration) {
        return;
      }

      console.log(`unregister ${registration.component.typeKey.description ?? '-'}`);

      if (registration.component.instanceKey) {
        delete componentsByInstanceKey.current[registration.component.instanceKey];
      }

      const byMyTypeKey = componentsByTypeKey.current[registration.component.typeKey];
      if (byMyTypeKey) {
        delete byMyTypeKey[registerKey];
        if (Object.keys(byMyTypeKey).length === 0) {
          delete componentsByTypeKey.current[registration.component.typeKey];
        }
      }

      delete componentsByRegisterKey.current[registerKey];

      getByType(componentsChangedListener).forEach((l) => l());
    },
    [getByType]
  );

  return { getByType, register, unregister };
}

export function useRegisteredComponent<T>(
  { register, unregister }: RegisterManager,
  src: RegisteredComponent<T>,
  data: T
) {
  useLayoutEffect(() => {
    const key = register(src, data);
    return () => {
      unregister(key);
    };
  }, [src, data, register, unregister]);
}
