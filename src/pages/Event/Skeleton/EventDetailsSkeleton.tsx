import { Skeleton } from 'components';

export const EventDetailsSkeleton = () => {
  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 animate-pulse">
      <div className="p-8">
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-full">
            <Skeleton variant="rounded" width={'40'} height={8} />
          </div>
          <div className="sm:col-span-2 sm:col-start-1">
            <div>
              <Skeleton variant="rounded" width={'40'} height={6} />
            </div>
            <div className="mt-2">
              <Skeleton variant="rounded" width={'full'} height={8} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <div>
              <Skeleton variant="rounded" width={'40'} height={6} />
            </div>
            <div className="mt-2">
              <Skeleton variant="rounded" width={'full'} height={8} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <div>
              <Skeleton variant="rounded" width={'40'} height={6} />
            </div>
            <div className="mt-2">
              <Skeleton variant="rounded" width={'full'} height={8} />
            </div>
          </div>
          <div className="sm:col-span-2 sm:col-start-1">
            <div>
              <Skeleton variant="rounded" width={'40'} height={6} />
            </div>
            <div className="mt-2">
              <Skeleton variant="rounded" width={'full'} height={8} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <div>
              <Skeleton variant="rounded" width={'40'} height={6} />
            </div>
            <div className="mt-2">
              <Skeleton variant="rounded" width={'full'} height={8} />
            </div>
          </div>
          <div className="sm:col-span-2 sm:col-start-1">
            <div>
              <Skeleton variant="rounded" width={'40'} height={6} />
            </div>
            <div className="mt-2">
              <Skeleton variant="rounded" width={'full'} height={8} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <div>
              <Skeleton variant="rounded" width={'40'} height={6} />
            </div>
            <div className="mt-2">
              <Skeleton variant="rounded" width={'full'} height={8} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
