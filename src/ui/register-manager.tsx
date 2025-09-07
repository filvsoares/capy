import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

export type RegisteredTypePart<T> = {
  _type?: T;
  typeKey: symbol;
};

export function registeredTypePart<T>(name?: string): RegisteredTypePart<T> {
  return { typeKey: Symbol(name) };
}

type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

type Data<T extends any[]> = UnionToIntersection<T[number]>;

export type RegisteredComponent<T> = {
  _type?: (arg: T) => T;
  typeKeys: symbol[];
  instanceKey?: symbol;
};

export function registeredAnonymousComponent<T extends any[], U extends Data<T>>(
  ...types: { [K in keyof T]: RegisteredTypePart<T[K]> }
): RegisteredComponent<U> {
  return { typeKeys: types.map((t) => t.typeKey) };
}

export function registeredComponent<T extends any[], U extends Data<T>>(
  ...types: { [K in keyof T]: RegisteredTypePart<T[K]> }
): RegisteredComponent<U> {
  return { typeKeys: types.map((t) => t.typeKey), instanceKey: Symbol() };
}

export type RegisterManager = {
  getByType: <T>(type: RegisteredTypePart<T>) => T[];
  getByInstance: <T>(component: RegisteredComponent<T>) => T | undefined;
  register: <T>(component: RegisteredComponent<T>, data: T) => symbol;
  unregister: (registerKey: symbol) => void;
};

type ComponentRegistration<T> = { component: RegisteredComponent<T>; data: T };

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

  const getByInstance = useCallback<RegisterManager['getByInstance']>((component) => {
    return component.instanceKey && componentsByInstanceKey.current[component.instanceKey]?.data;
  }, []);

  const register = useCallback<RegisterManager['register']>((component, data) => {
    const registration = { component, data };
    const registerKey = Symbol();

    if (component.instanceKey) {
      if (componentsByInstanceKey.current[component.instanceKey]) {
        throw new Error('There is more than one component using the same instanceKey');
      }
      componentsByInstanceKey.current[component.instanceKey] = registration;
    }

    for (const typeKey of component.typeKeys) {
      let byMyTypeKey = componentsByTypeKey.current[typeKey];
      if (!byMyTypeKey) {
        componentsByTypeKey.current[typeKey] = byMyTypeKey = {};
      }
      byMyTypeKey[registerKey] = registration;
    }

    componentsByRegisterKey.current[registerKey] = registration;

    console.log(
      `registered [${
        component.instanceKey ? component.instanceKey?.description ?? 'unnamed' : 'anonymous'
      }] with types ${component.typeKeys.map((t) => t.description).join(', ')}`
    );
    return registerKey;
  }, []);

  const unregister = useCallback<RegisterManager['unregister']>((registerKey) => {
    const registration = componentsByRegisterKey.current[registerKey];
    if (!registration) {
      return;
    }

    if (registration.component.instanceKey) {
      delete componentsByInstanceKey.current[registration.component.instanceKey];
    }

    for (const typeKey of registration.component.typeKeys) {
      const byMyTypeKey = componentsByTypeKey.current[typeKey];
      if (byMyTypeKey) {
        delete byMyTypeKey[registerKey];
        if (Object.keys(byMyTypeKey).length === 0) {
          delete componentsByTypeKey.current[typeKey];
        }
      }
    }

    delete componentsByRegisterKey.current[registerKey];

    console.log(
      `unregistered [${
        registration.component.instanceKey ? registration.component.instanceKey?.description ?? 'unnamed' : 'anonymous'
      }]`
    );
  }, []);

  return useMemo(
    () => ({ getByType, getByInstance, register, unregister }),
    [getByType, getByInstance, register, unregister]
  );
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
