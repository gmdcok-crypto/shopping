export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">스토어 설정</h1>
        <p className="mt-1 text-sm text-gray-500">
          스토어 기본 정보 및 운영 설정입니다.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900">기본 정보</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <dt className="text-gray-500">스토어명</dt>
            <dd className="font-medium text-gray-900">HARAL</dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <dt className="text-gray-500">스토어 URL</dt>
            <dd className="font-medium text-gray-900">/ko/</dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <dt className="text-gray-500">배송 정책</dt>
            <dd className="font-medium text-gray-900">5만원 이상 무료배송</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">관리자 인증</dt>
            <dd className="font-medium text-gray-900">API 키 (ADMIN_API_KEY)</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <p className="font-semibold">안내</p>
        <p className="mt-2 leading-relaxed text-amber-800">
          정산, 고객 문의, 광고 관리 등은 추후 추가될 예정입니다. 상품·주문 관리는
          좌측 메뉴에서 이용하세요.
        </p>
      </section>
    </div>
  );
}
